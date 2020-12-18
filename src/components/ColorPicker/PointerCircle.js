import React from "react";
import reactCSS from "reactcss";

export const PointerCircle = () => {
  const styles = reactCSS({
    default: {
      picker: {
        width: "16px",
        height: "16px",
        borderRadius: "8px",
        boxShadow: "inset 0 0 0 1px #fff",
        transform: "translate(-6px, -6px)"
      }
    }
  });

  return <div style={styles.picker} />;
};

export default PointerCircle;
