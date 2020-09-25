import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

const useDataApi = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setIsError(false);

      try {
        const result = await axios(url);

        setData(result.data);
      } catch (err) {
        setIsError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [url]);

  return [{ data, loading, isError }, setUrl];
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