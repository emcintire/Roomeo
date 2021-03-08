import React,{ Component } from 'react'

class Form extends Component{ 
constructor(props){ 
	super(props) 
	this.state = { email:'',name:'', password:'' } 
	this.handleChange = this.handleChange.bind(this) 
	this.handleSubmit = this.handleSubmit.bind(this) 
} 

handleSubmit = async event => {
    event.preventDefault();
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
};

handleChange(event){ 
	this.setState({ 
	[event.target.name] : event.target.value 
	}) 
} 

render(){ 
	return( 
	<form onSubmit={this.handleSubmit}> 
		<div> 
		<label htmlFor='email'>Email</label> 
		<input 
			name='email'
			placeholder='Email'
			value = {this.state.email} 
			onChange={this.handleChange} 
		/> 
		</div> 
		<div> 
		<label htmlFor='name'>Name</label> 
		<input 
			name='name'
			placeholder='Name'
			value={this.state.name} 
			onChange={this.handleChange} 
		/> 
		</div> 
		<div> 
		<label htmlFor='password'>Password</label> 
		<input 
			name='password'
			placeholder='Password'
			value={this.state.password} 
			onChange={this.handleChange} 
		/> 
		</div> 
		<div> 
		<button>Create Account</button> 
		</div>
        <p>{this.state.responseToPost}</p> 
	</form> 
	) 
} 
} 

export default Form

