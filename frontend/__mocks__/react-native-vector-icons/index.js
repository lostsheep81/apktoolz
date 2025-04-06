// Base mock for react-native-vector-icons
const React = require('react');
const { Text } = require('react-native');

const createIconSet = (glyphMap) => {
  const IconClass = function(props) {
    return React.createElement(Text, {
      ...props,
      testID: `icon-${props.name || 'unknown'}`
    }, props.name || '');
  };

  IconClass.Button = function(props) {
    return React.createElement(Text, {
      ...props,
      testID: `icon-button-${props.name || 'unknown'}`
    }, props.children);
  };

  return IconClass;
};

module.exports = {
  createIconSet
};