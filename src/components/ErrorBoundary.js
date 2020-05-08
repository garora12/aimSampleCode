import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
    this.error = error
		//console.log(error, info);
  }

  render() {
    if(this.state.hasError) return (

      <div>
        <h1>Ooops</h1>
        <p>
          We're sorry to see that you encountered an error.  Please let us know by contacting support at <a href="mailto:customercare@scilicet.com">customercare@scilicet.com</a>
        </p>
      </div>
    );
    return this.props.children;
  }
}

export default ErrorBoundary;
