const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: ["next", "sl"],
  rules: {
    "@next/next/no-html-link-for-pages": OFF,
    "react/jsx-key": OFF,
  },
};
