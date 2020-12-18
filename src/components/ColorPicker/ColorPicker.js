import React from "react";
import reactCSS from "reactcss";
import PropTypes from "prop-types";
import merge from "lodash/merge";
import { CustomPicker } from "react-color";
import {
  Hue,
  Saturation,
  EditableInput
} from "react-color/lib/components/common";
import color from "react-color/lib/helpers/color";
import MyPointer from "./PointerCircle";
import { WHITE } from "../../content/color";
import Pointer from "./Pointer";

export const ColorPicker = ({
  rgb,
  hsl,
  onChange,
  width,
  hex,
  hsv,
  pointer,
  disableAlpha,
  styles: passedStyles = {}
}) => {
  const styles = reactCSS(
    merge(
      {
        default: {
          picker: {
            width,
            padding: "10px 10px 0",
            boxSizing: "initial",
            background: "#fff",
            borderRadius: "4px",
            boxShadow: "0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)"
          },
          saturation: {
            width: "100%",
            paddingBottom: "75%",
            position: "relative",
            overflow: "hidden"
          },
          Saturation: {
            radius: "3px",
            shadow:
              "inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"
          },
          controls: {
            display: "flex"
          },
          sliders: {
            padding: "4px 0",
            flex: "1"
          },
          color: {
            width: "24px",
            height: "24px",
            position: "relative",
            marginTop: "4px",
            marginLeft: "4px",
            borderRadius: "3px"
          },
          activeColor: {
            absolute: "0px 0px 0px 0px",
            borderRadius: "2px",
            background: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`,
            boxShadow:
              "inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"
          },
          hue: {
            position: "relative",
            height: "10px",
            overflow: "hidden"
          },
          Hue: {
            radius: "2px",
            shadow:
              "inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"
          },
          ...passedStyles
        },
        disableAlpha: {
          color: {
            height: "10px"
          },
          hue: {
            height: "10px"
          }
        }
      },
      passedStyles
    ),
    { disableAlpha }
  );

  const handleChange = (hexCode, e) => {
    color.isValidHex(hexCode) &&
      onChange(
        {
          hex: hexCode,
          source: "hex"
        },
        e
      ) &&
      this.props.setColor(hexCode);
  };

  return (
    <div
      style={{
        // boxShadow: "0 0 3px rgba(0,0,0,0.1)",
        // height: 18,
        width: 200,
        position: "relative"
        // padding: 10,
        // backgroundColor: WHITE
      }}
    >
      <div
        style={{
          ...styles.saturation,
          boxShadow: "0 0 3px rgba(0,0,0,0.1)",
          backgroundColor: WHITE
          // padding: 10
        }}
      >
        <Saturation
          style={styles.Saturation}
          hsl={hsl}
          hsv={hsv}
          onChange={onChange}
          pointer={MyPointer}
        />
      </div>
      <div
        style={{
          width: "100%",
          paddingTop: "75%",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Hue
          style={styles.Hue}
          hsl={hsl}
          pointer={pointer}
          onChange={onChange}
        />
      </div>

      <EditableInput
        style={{ input: styles.input }}
        value={hex}
        onChange={handleChange}
      />
    </div>
  );
};
ColorPicker.propTypes = {
  styles: PropTypes.object
};
ColorPicker.defaultProps = {
  width: "316px",
  height: "16px",
  direction: "horizontal",
  pointer: Pointer,
  styles: {}
};
export default CustomPicker(ColorPicker);
