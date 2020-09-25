import React, {
  useState,
  useEffect,
  Fragment,
  useReducer,
} from 'react';
import axios from 'axios';

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);
  const [state, dispatch] = useReducer(dataFetchReducer, {
    loading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await axios(url);

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (err) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
}

function App() {
  const [query, setQuery] = useState('redux');
  const [{ data, loading, isError }, doFetch] = useDataApi(
    'https://hn.algolia.com/api/v1/search?query=redux',
    { hits: [] },
  );

  function onQueryChange(e) {
    setQuery(e.target.value);
  }

  function onSearch(e) {
    doFetch(`https://hn.algolia.com/api/v1/search?query=${query}`);
    e.preventDefault();
  }

  return (
    <Fragment>
      <form onSubmit={onSearch}>
        <input
          type="text"
          value={query}
          onChange={onQueryChange}
        />
        <button type="submit">Search</button>
      </form>
      {isError && <div>Error happens when fetching data</div>}
      {
        loading ? <div>Loading... ...</div> :
          <ul>
            {data.hits.map(item => (
              <li key={item.objectID}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
          </ul>
      }
    </Fragment>
  );
}

export default App;