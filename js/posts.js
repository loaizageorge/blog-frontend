const postsComponent = {
  template: '#posts',
  name: 'PostsComponent',
  data() {
    return {
      posts: [
        {
          id: 1,
          title: 'Title',
          body: 'Content',
          created_at: '2022-06-15 19:59:22',
          user: {
            name: 'George'
          }
        },
        {
          id: 2,
          title: 'Title 2',
          body: 'Content 2',
          created_at: '2022-06-15 19:59:22',
          user: {
            name: 'George'
          }
        },
        {
          id: 3,
          title: 'Title 3',
          body: 'Content 3',
          created_at: '2022-06-15 19:59:22',
          user: {
            name: 'George'
          }
        },
      ],
    }
  },
};

export default postsComponent;
