import React, { useState } from "react";
import styled from "styled-components";
import Loader from "./Loader";

const LoaderMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


const LoaderHolder = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Loading = (props) => {
  return (
    <LoaderHolder>
      <LoaderMain>
        <Loader />
        <p>{props.message}</p>
      </LoaderMain>
    </LoaderHolder>
  );
};

export const IsLoadingHOC = (WrappedComponent, loadingMessage) => {
  function HOC(props) {
    const [isLoading, setLoading] = useState(true);
    const setLoadingState = (isComponentLoading) => {
      setLoading(isComponentLoading);
    };

    return (
      <>
        {isLoading && <Loading message={loadingMessage} />}
        <WrappedComponent {...props} setLoading={setLoadingState} />
      </>
    );
  }
  return HOC;
};

export default IsLoadingHOC;
