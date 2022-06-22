$(document).ready(function() {
  // Please write your JS in scripts.js
  console.log('Login ready');
  const apiRoot = 'http://localhost/api';

  // make sure to include cross site forgery token in every request after we are authenticated
  const getXSFR = () => {
    if (!document.cookie) {
      return '';
    }
    let xsrfCookie = document.cookie.split(';').find((c) => {
      const keyValue = c.split('=');
      if (keyValue[0] === 'XSRF-TOKEN') {
        return c;
      }
    });
    // remove the encoded "=" that is showing up for some reason
    return xsrfCookie.split('=')[1].replace('%3D', '').trim();
  };

  const fetchOptions = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN':getXSFR(),
      mode: 'cors',
    },
  };

  // set the component, action, and id (if applicable) for the next screen
  // the actual rendering apps in app.render
  const setComponent = (params) => {
    const {currentComponent, action = '', id = ''} = params;
    app.currentComponent = currentComponent;
    app.action = action;
    app.id = id;
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const registerComponent = {
    template: '#signUp',
    name: 'UserLoginComponent',
    data() {
      return {
        user: {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          passwordCheck: '',
        },
        valid: true,
        validPasswordCheck: true,
      };

    },
    computed: {
      isFormValid() {
        return (
            this.isValid('firstname') &&
            this.isValid('lastname') &&
            this.isValid('email') &&
            this.isValid('password') &&
            this.isValid('passwordCheck'));
      },
    },
    watch: {},

    methods: {
      isValid(prop) {
        switch (prop) {
          case 'firstname':
            return this.user.firstname.length >= 2;
            break;
          case 'lastname':
            return this.user.lastname.length >= 2;
            break;
          case 'email':
            return emailRegex.test(this.user.email);
            break;
          case 'password':
            return this.user.password.length >= 6;
            break;
          case 'passwordCheck':
            return this.user.password === this.user.passwordCheck;
            break;
          default:
            return false;
        }

      },
      resetUser() {
        this.user.firstname = '';
        this.user.lastname = '';
        this.user.email = '';
        this.user.password = '';
        this.user.passwordCheck = '';
      },

      async onSubmit() {
        let user = Object.assign({}, this.user);

        // get laravel csrf token first
        const csrf = 'http://localhost/sanctum/csrf-cookie';
        await fetch(csrf, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const url = `${apiRoot}/users`;
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN':getXSFR(),
            mode: 'cors',
          },
          method: 'POST',
          body: JSON.stringify(user),
        });
        await response.json()
        this.$emit('register-form', {
          type: 'register',
          data: user,
        });
        setTimeout(() => {
          this.setComponent({currentComponent: 'feedback'});
        }, 280);
        this.resetUser();

      },
      setComponent,
      validatePasswordCheck() {
        this.validPasswordCheck = this.isValid('passwordCheck')
      }
    },

    //   Refactored: Using a @blur on the password check selector and v-bind:class to dynamically add the invalid class
    //   saves manually modifying the dom as well as an event listener
    // mounted() {
    //   // Bonus: Password Validation
    //   // Can this be refactored?
    //
    //   let element = this.$el.querySelector('#passwordcheck');
    //   element.addEventListener('blur', () => {
    //     if (!this.isValid('passwordCheck')) {
    //       element.classList.add('invalid');
    //     } else {
    //       element.classList.remove('invalid');
    //     }
    //   });
    // },
  };

  const signInComponent = {
    template: '#signinIn',
    name: 'SigninComponent',
    data() {
      return {
        user: {
          email: '',
          password: '',
        },
      };

    },
    methods: {
      async handleForm() {
        let formvalue = Object.assign({}, this.user);
        //this.resetFormValues();
        const csrf = 'http://localhost/sanctum/csrf-cookie';
        await fetch(csrf, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const url = `${apiRoot}/auth/login`;
        const response = await fetch(url, {...fetchOptions,
          method: 'POST',
          body: JSON.stringify(formvalue),
        });
        const data = await response.json();
        // stash the user into global state, so we can check if they are authenticated
        app.user = data.user;

        this.$emit('signin-form', {
          type: 'signin',
          data: formvalue,
        });
      },
      resetFormValues() {
        this.user.email = '';
        this.user.password = '';
      },
      isValid(prop) {
        switch (prop) {
          case 'email':
            return emailRegex.test(this.user.email);
            break;
          case 'password':
            return this.user.password.length >= 6;
            break;
          default:
            return false;
        }
      },

    },
    computed: {
      isFormValid() {
        return this.isValid('email') && this.isValid('password');
      },
    },

  };

  const feedbackComponent = {
    template: '#loginFeedback',
    name: 'loginComponent',
    filters: {
      email(input) {
        if (input.email) {
          return input.email;
        } else {
          return '';
        }
      },
      name(input) {
        return input.firstname ? input.firstname : '';
      },
    },

    data() {
      return {};
    },
    props: ['feedback'],
    computed: {
      title() {
        return this.feedback.type === 'signin' ?
            'Login Successful!' : 'Sign Up';
      },
    },
  };

  const createPostComponent = {
    template: '#createPost',
    name: 'createPostComponent',
    data() {
      return {
        title: '',
        body: '',
        action: '',
        id: '',
        feedback: {},
      };
    },
    async mounted() {
      // if editing, get the data for the post
      this.action = this.$root.action;
      const postId = this.$root.id;

      if (this.action === 'edit') {
        const api = `${apiRoot}/posts/${postId}`;
        const response = await fetch(api, fetchOptions);
        const post = await response.json();
        this.title = post.data.title;
        this.body = post.data.body;
        this.id = post.data.id;
      }

    },
    methods: {
      async handleSubmit() {
        let api = `${apiRoot}/posts`;
        if (this.action === 'edit') {
          api = api.concat(`/${this.id}`);
        }
        const response = await fetch(api, {credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN':getXSFR(),
            mode: 'cors',
          },
          method: this.action === 'edit' ? 'PUT' : 'POST',
          body: JSON.stringify({
            title: this.title,
            body: this.body,
            id: this.id,
          }),
        });
        const data = await response.json();
      },
      setComponent,
    },
    computed: {
      isFormValid() {
        return this.title && this.body;
      },
    },
  };

  // Comment component
  const createCommentComponent = {
    template: '#createComment',
    name: 'createCommentComponent',
    props: ['postId'],
    data() {
      return {
        id: '',
        body: '',
        action: '',
      };
    },
    async mounted() {
      // if editing, get the data for the post
      this.action = this.$root.action;
      const commentId = this.$root.id;
      if (this.action === 'edit') {
        const api = `${apiRoot}/comments/${commentId}`;
        const response = await fetch(api, fetchOptions);
        const comment = await response.json();
        this.id = comment.data.id;
        this.body = comment.data.body;
      }
    },
    methods: {
      async handleSubmit() {
        let api = `${apiRoot}/comments`;
        if (this.action === 'edit') {
          api = api.concat(`/${this.id}`);
        }

        const response = await fetch(api, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN':getXSFR(),
            mode: 'cors',
          },
          method: this.action === 'edit' ? 'PUT' : 'POST',
          body: JSON.stringify({
            body: this.body,
            post_id: this.postId,
          }),
        });
        const data = await response.json();
      },
    },
    computed: {
      isFormValid() {
        return this.body;
      },
    },
  };

  const commentComponent = {
    template: '#comment',
    name: 'commentComponent',
    props: ['comment', 'userId'],
    methods: {
      async deleteComment() {
        const api = `${apiRoot}/comments/${this.comment.id}`;
        const response = await fetch(api, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getXSFR(),
            mode: 'cors',
          }
        });
      },
      setComponent
    }
  }

  const postComponent = {
    template: '#post',
    name: 'postComponent',
    props: ['post', 'userId'],
    methods: {
      async deletePost() {
        const api = `${apiRoot}/posts/${this.post.id}`;
        const options = {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN':getXSFR(),
            mode: 'cors',
          },
          method: 'DELETE'
        };
        const response = await fetch(api, options);
        // TODO: redirect to all posts
      },
      setComponent
    },
  };

  const viewPostComponent = {
    template: '#viewPost',
    name: 'viewPostComponent',
    components: {
      createcomment: createCommentComponent,
      post: postComponent,
      comment: commentComponent,
    },
    data() {
      return {
        post: null,
        user: this.$root.user
      };
    },
    async mounted() {
      const postId = this.$root.id;
      const api = `${apiRoot}/posts/${postId}`;
      const response = await fetch(api, fetchOptions);
      const post = await response.json();
      this.post = post.data;
    },
  };

  const postsComponent = {
    template: '#posts',
    name: 'postsComponent',
    components: {
      post: postComponent,
    },
    data() {
      return {
        posts: [],
      };
    },
    async mounted() {
      const api = `${apiRoot}/posts`;
      const response = await fetch(api, fetchOptions);
      const posts = await response.json();
      this.posts = posts.data;
    },
  };

  const app = new Vue({
    el: '#app',
    components: {
      register: registerComponent,
      signin: signInComponent,
      feedback: feedbackComponent,
      posts: postsComponent,
      post: postComponent,
      createPost: createPostComponent,
      createComment: createCommentComponent,
      viewPost: viewPostComponent,
      comment: commentComponent,
    },

    name: 'application',
    data() {
      return {
        title: 'Register',
        feedback: {},
        currentComponent: 'signin',
        // routing
        action: '',
        id: '',
        // global variable
        user: null,
      };
    },
    methods: {
      handleForm(data) {
        this.feedback = data;
        setTimeout(() => {
          this.setComponent({currentComponent: 'feedback'});
        }, 280);
      },
      isDisabled(btnName) {
        return this.currentComponent === btnName;
      },
      setComponent,
      logout() {
        this.user = null;
        this.setComponent({currentComponent: 'signin'});
      }
    },
  });
});
  