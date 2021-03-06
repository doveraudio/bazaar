import React from 'react';
import { StackNavigator } from 'react-navigation';
import moment from 'moment';

import Profile from 'app/screens/User/screens/Profile';
import Order from 'app/screens/User/screens/Order';
import Cart from 'app/screens/User/screens/Cart';
import Membership from 'app/screens/User/screens/Membership';
import DeleteAccount from 'app/screens/User/screens/DeleteAccount';

const routeConfig = {
  Profile: {
    screen: (props) => {
      return <Profile navigation={props.navigation} lang={props.screenProps.lang} />;
    },
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  },
  Order: {
    screen: (props) => {
      return <Order navigation={props.navigation} lang={props.screenProps.lang} />;
    },
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  },
  Cart: {
    screen: (props) => {
      return <Cart navigation={props.navigation} lang={props.screenProps.lang} />;
    },
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  },
  Membership: {
    screen: (props) => {
      return <Membership navigation={props.navigation} lang={props.screenProps.lang} />;
    },
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  },
  DeleteAccount: {
    screen: (props) => {
      return <DeleteAccount navigation={props.navigation} lang={props.screenProps.lang} />;
      },
      navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  },
};

const navigatorConfig = {};

export default StackNavigator(routeConfig, navigatorConfig);
