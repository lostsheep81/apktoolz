// Mock for FontAwesome icons
const React = require('react');
const { Text } = require('react-native');

const IconComponent = function(props) {
  return React.createElement(Text, {
    ...props,
    testID: `icon-${props.name || 'unknown'}`
  }, props.name || '');
};

// Add named exports for specific icons that might be used
IconComponent.Button = function(props) {
  return React.createElement(Text, {
    ...props,
    testID: `icon-button-${props.name || 'unknown'}`
  }, props.children);
};

module.exports = IconComponent;