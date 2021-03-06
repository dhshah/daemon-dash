import React from 'react';
import { browserHistory } from 'react-router';
import { Button, Form } from 'semantic-ui-react';
import $ from 'jquery';

import styles from './LoginPage.scss';
import isMobile from '../../isMobile';

export default class LoginPage extends React.Component {

  static getRedirectEndpoint(resp) {
    if (resp.type === 'student') {
      return '/stream/student';
    } else if (isMobile()) {
      return '/stream/recording';
    }
    return '/stream/teacher';
  }

  static handleSubmit(event, { formData }) {
    event.preventDefault();
    console.log(formData);
    $.post({
      url: '/api/login',
      data: formData,
      success: ((resp) => {
        console.log(resp);
        if (!resp.error) {
          browserHistory.push(LoginPage.getRedirectEndpoint(resp));
        } else {
          console.error(resp.error);
        }
      }),
    });
  }

  componentWillMount() {
    $.get('/api/req', (resp) => {
      console.log(resp);
      if (resp.isAuthenticated) {
        browserHistory.push(LoginPage.getRedirectEndpoint(resp));
      }
    });
  }

  render() {
    return (
      <div className={styles.loginPanelParent}>
        <div className={styles.loginPanel}>
          <Form onSubmit={LoginPage.handleSubmit}>
            <Form.Input
              className={styles.input} fluid name="email" icon="mail"
              iconPosition="left" placeholder="Email address"
            />
            <Form.Input
              className={styles.input}
              type="password" name="password"
              fluid icon="lock" iconPosition="left" placeholder="Password"
            />
            <Button fluid type="submit">Sign in</Button>
          </Form>
        </div>
      </div>
    );
  }
}
