import { WHITE, BLACK, DARK_GREY } from "./color";
import { INTENT } from "./const";

export const style = {
  navigation: {
    display: "flex"
  },
  link: {
    marginRight: 16
  },
  flexOne: { flex: 1 },
  flexTwo: { flex: 2 },
  linkText: {
    textDecoration: "none",
    fontFamily: "GraphikLCG-Medium"
  }
};
export const divStyle = {
  intent: {
    paddingLeft: INTENT,
    paddingRight: INTENT
  },
  page: {
    backgroundColor: WHITE,
    flex: 1
  },
  table: {
    paddingTop: 40
  }
};

export const textStyle = {
  linkText: {
    textDecoration: "none",
    fontFamily: "GraphikLCG-Medium",
    fontSize: 13,
    letterSpacing: 0.24
  },
  table: {
    display: "flex"
  },
  cardHeader: {
    fontFamily: "GraphikLCG-Medium",
    fontWeight: "lighter",
    fontSize: 14,
    lineHeight: 1.8
  },
  activeLinkBar: {
    textDecoration: "none",
    fontFamily: "GraphikLCG-Medium",
    fontSize: 13,
    color: BLACK,
    marginRight: 10,
    paddingRight: 10
  },
  linkBar: {
    textDecoration: "none",
    fontFamily: "GraphikLCG-Medium",
    fontSize: 13,
    color: DARK_GREY,
    marginRight: 10,
    paddingRight: 10
  }
};
