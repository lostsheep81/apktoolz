// Mock for react-native-progress
const Bar = jest.fn(props => ({
  ...props,
  type: 'Progress.Bar'
}));

const Circle = jest.fn(props => ({
  ...props,
  type: 'Progress.Circle'
}));

const Pie = jest.fn(props => ({
  ...props,
  type: 'Progress.Pie'
}));

const CircleSnail = jest.fn(props => ({
  ...props,
  type: 'Progress.CircleSnail'
}));

module.exports = {
  Bar,
  Circle,
  Pie,
  CircleSnail
};