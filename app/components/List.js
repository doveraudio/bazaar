import React from 'react';
import { View, ListView, RefreshControl } from 'react-native';

export default class List extends React.Component {
  onRefresh() {
    this.props.onRefresh();
  }

  render() {
    let props = this.props;
    let refreshing = this.props.refreshing || false;

    return (
      <ListView {...props} refreshControl={<RefreshControl onRefresh={this.onRefresh.bind(this)} refreshing={refreshing} />} style={{backgroundColor: '#f4f4f0'}} />
    );
  }
}
