import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  /**ref is a value that persists after each render
   * because inside of react every single thing that we do is only stored inside that render
   * unless it's part of state
   * but if we wanna store something between renders that isn't part of our state,
   * we need to use ref
   * and ref is good when you need to store references to element
   * for example if we wanna get a reference to our books element or input element
   * or if you wanna reference to something related to the document API
   * and in this case, we are using intersection observer
   * which is part of the document API
   */

   /**first time this gets ran,
    * this is gonna have undefined as the value
    * which is okay
    *
    * useRef is not part of our state
    * so it doesn't update every single time that it changes
    * so when our reference changes,
    * it doesn't rerun our component
    * so we will use 'useCallback' which has a really unique interaction with useRef
    */
  const observer = useRef();
  /**and we also need to get a reference to the very last book element
   * because we are gonna make it scroll all the way down
   * and that our very last book element is shown on the screen,
   * and then we change our page number and add one to it
   *
   * so intersection observer is gonna allow us to say
   * when something's on our screen
   * but we need to get an element reference to that very last element in our books array
   * in order to know which element is the last one
  */
  const lastBookElementRef = useCallback(
    node => {
      if (loading) return;
      /**this gonna disconnect our observer from the previous element
       * last element will be hooked up correct
       */
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          console.log('visible')
          setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <div className="input">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          className="inputText"
        />
      </div>
      <div className="inputList">
        {
          books.map((book, index) => {
            if (books.length === index + 1) {
              return (
                <div className="book" ref={lastBookElementRef} key={book}>
                  {book}
                </div>
              );
            } else {
              return <div className="book" key={book}>{book}</div>;
            }
          })
        }
        {
          loading === true ? <div className="loading">Loading...</div> : null
        }
        <div className="error">{error && "Error"}</div>
      </div>
    </>
  );
}
