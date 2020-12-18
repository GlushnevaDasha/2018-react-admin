import React from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetPasswordByEmailForm from "./ResetPasswordByEmailForm";

import "../../index.css";
import "../../stylesheets/pages/Registration/index.css";

function Link(props) {
  return <a href={props.link || "/"}>{props.text}</a>;
}

class BodyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false
    };
  }
  render() {
    return (
      <div className="registrationPage">
        <span className="logo">Wylsacom App Admin</span>

        <div className="form">{this.props.children}</div>

        <div className="links">
          <Link text={"Читать гайд"} />
          <Link text={"Поддержка"} />
          <Link text={"О проекте"} />
        </div>
      </div>
    );
  }
}

export function SignInPage() {
  return (
    <BodyPage>
      <SignInForm />
    </BodyPage>
  );
}

export function ResetPasswordPage() {
  return (
    <BodyPage>
      <ResetPasswordForm
        isShow={() => {
          this.setState({
            isShow: !this.state.isShow
          });
        }}
      />
    </BodyPage>
  );
}

export function ResetPasswordByEmailPage() {
  return (
    <BodyPage>
      <ResetPasswordByEmailForm />
    </BodyPage>
  );
}

export function SignUpPage() {
  return (
    <BodyPage>
      <SignUpForm />
    </BodyPage>
  );
}
