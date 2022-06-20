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
  methods: {
    handleSubmit() {
      console.log(this.title);
      console.log(this.body);
    }
  }
}

export default createPostComponent;