import React from "react";

const FlatList = props => {
  return (
    <main>
      <section
        style={
          props.column
            ? {
                ...style.cards,
                gridTemplateColumns: `repeat(auto-fill, minmax(${props.column}px, 1fr))`
              }
            : {
                ...style.cards,
                gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`
              }
        }
      >
        {props.children}
      </section>
    </main>
  );
};

export default FlatList;

const style = {
  cards: {
    maxWidth: "100%",
    margin: "20 0 0 20",
    display: "grid",
    gridGap: 15
  }
};
