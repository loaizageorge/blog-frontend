$(document).ready(function() {
    // Please write your JS in scripts.js
    console.log('Login ready');
    const apiRoot = 'http://localhost/api';

  const getXSFR = () => {
    let xsrfCookie = document.cookie.split(';').find((c) => {
      const keyValue = c.split('=');
      if (keyValue[0] === 'XSRF-TOKEN') {
        return c;
      }
    });
    return xsrfCookie.split('=')[1].replace('%3D', '');
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
            passwordCheck: ''
          },
          valid: true
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
        }
      },

      watch: {
      },

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
            case "passwordCheck":
              return this.user.password === this.user.passwordCheck;
              break;
            default:
              return false;
          }

        },
        passwordLength(prop){
            console.log(prop)
        },
        resetUser() {
          this.user.firstname = '';
          this.user.lastname = '';
          this.user.email = '';
          this.user.password = '';
          this.user.passwordCheck = '';
        },
        // Catch 401
        async onSubmit() {
          let user = Object.assign({}, this.user);
          const url = 'http://localhost/api/users';
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
          });
          console.log(JSON.stringify(response.body));
          //this.resetUser();
          this.$emit('register-form', {
            type: 'register',
            data: user
          });
        }
      },

      mounted() {
        // Bonus: Password Validation
        // Can this be refactored?
        // let element = this.$el.querySelector('#passwordcheck');
        // element.addEventListener('blur', () => {
        //   if (!this.isValid('passwordCheck')) {
        //     element.classList.add('invalid');
        //   } else {
        //     element.classList.remove('invalid');
        //   }
        // });
      }
    };


    const signInComponent = {
      template: '#signinIn',
      name: 'SigninComponent',
      data() {
        return {
          user: {
            email: '',
            password: ''
          }
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
            }
          });
          let xsrfCookie = document.cookie.split(';').find((c) => {
            const keyValue = c.split('=');
            if (keyValue[0] === 'XSRF-TOKEN') {
              return c;
            }
          });
          const url = 'http://localhost/api/auth/login';
          // not sure why sanctum is including an = character, but removing the encoded equilvalent from here
          let xsrf = xsrfCookie.split('=')[1].replace('%3D', '');
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(formvalue),
            credentials: 'include',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cache': 'no-cache',
              'X-XSRF-TOKEN': xsrf,
            }
          });


          this.$emit('signin-form', {
            type: 'signin',
            data: formvalue
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

        }
      },

      computed: {
        isFormValid() {
          return this.isValid('email') && this.isValid('password');
        }
      }
    };



    const feedbackComponent = {
      template: '#loginFeedback',
      name: "loginComponent",
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
        }
      },

      data() {
        return {};
      },
      props: ['feedback'],
      computed: {
        title() {
          return this.feedback.type === 'signin' ?
            'Login Successful!' : 'Sign Up';
        }
      }
    };

  const createPostComponent = {
    template: '#createPost',
    name: 'createPostComponent',
    data() {
      return {
        title: '',
        body: '',
        feedback: {}
      }
    },
    async mounted() {
      this.title = 'test';
      this.body = 'body';
      const params = new URLSearchParams(window.location.search);
      // if editing, get the data for the post
      const api = `http://localhost/api/posts/${params.get('id')}`;
      const response  = await fetch(api, {
        credentials: 'include',
      });
      console.log(response);
    },
    methods: {
      async handleSubmit() {
        const api = `${apiRoot}/posts`;
        const response = await fetch(api, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getXSFR(),
          },
          body: JSON.stringify({
            title: this.title,
            body: this.body
          })
        });
        const data = await response.json();
        console.log(data);
      },
    },
    computed: {
      isFormValid() {
        return this.title && this.body;
      }
    }
  }

  const work = {
    template: '#work',
    name: 'work',
    props: ['postId'],
    data() {
      return {
        body: '',
        postId: this.postId,
      }
    },
    methods: {
      async handleSubmit() {
        const api = `${apiRoot}/comments`;
        const response = await fetch(api, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getXSFR(),
          },
          body: JSON.stringify({
            body: this.body,
            post_id: this.postId,
          })
        });
        const data = await response.json();

      },
    },
    computed: {
      isFormValid() {
        return this.body;
      }
    }
  }

  const commentComponent = {
    template: '#comment',
    name: 'commentComponent',
    props: ['comment']
  }

  const postComponent = {
    template: '#post',
    name: 'postComponent',
    props: ['post', 'detailed'],
  }

  const viewPostComponent = {
    template: '#viewPost',
    name: 'viewPostComponent',
    components: {
      work: work,
      post: postComponent,
      comment: commentComponent,
    },
    data() {
      return {
        post: null
      }
    },
    async mounted() {
      const api = `${apiRoot}/posts/2`;
      const response = await fetch(api, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getXSFR(),
        },
      });
      const post = await response.json();
      this.post = post.data;
      console.log(this.post);
    }
  }



  const postsComponent = {
    template: '#posts',
    name: 'postsComponent',
    components: {
      post: postComponent,

    },
    data() {
      return {
        posts: [],
      }
    },
    async mounted() {
      const api = `${apiRoot}/posts`;
      const response = await fetch(api, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getXSFR(),
        },
      });
      const posts = await response.json();
      this.posts = posts.data;
    }
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
        work: work,
        viewPost: viewPostComponent,
      },

      name: 'application',
      data() {
        return {
          feedback: {},
          currentComponent: 'viewPost',
        };

      },
      methods: {
        handleForm(data) {
          this.feedback = data;
          // setTimeout(() => {
          //   this.setView('feedback');
          // }, 280);
        },
        isDisabled(btnName) {
          return this.currentComponent === btnName;
        },
        setView(componentName) {
          if (this.currentComponent !== componentName) {
            this.currentComponent = componentName;
          }
        }
      }
    });

  })
  