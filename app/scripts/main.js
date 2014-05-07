'use strict';

(function($){


    var ScribblePost = Backbone.Model.extend({
        idAttribute: 'Id',
        defaults: function() {
            return {
                Content: '(empty)'
            }
        },
        initialize: function() {
            this.on('change', function() {
                console.log('model changed', this);
            });
        }
    });


    var ScribblePostView = Backbone.View.extend({
        tagName: 'div',
        className: 'post',
        template: _.template($('#scrb-post').html()),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'remove', this.remove);
        },
        render: function() {
            console.log('render post');
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });


    var ScribblePostsView = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.collection, 'reset sort', this.render);
            this.listenTo(this.collection, 'add', this.addPost);
        },
        render: function() {
            console.log('rendering collection');
            var container = document.createDocumentFragment();
            this.collection.each(function(post) {
                var postView = new ScribblePostView({
                    model: post
                });
                container.appendChild(postView.render().el);
            }, this );
            this.$el.append(container);
            return this;
        },
        addPost: function(post) {
            console.log('adding a single post');
            var postView = new ScribblePostView({model: post});
            this.$el.prepend(postView.render().el); // TODO: Assumes that only new posts are added (i.e. to the top)
        }
    });


    var ScribblePosts = Backbone.Collection.extend({
        model: ScribblePost,
        initialize: function() {
            this.on('add', function() {
                console.log('model added to posts collection');
            });
            this.on('remove', function(post) {
                console.log('model removed from posts collection');
            });
            this.on('reset', function() {
                console.log('posts collection was reset');
            });
        }
    });


    var ScribbleEmbedView = Backbone.View.extend({
        el: $('#scribbleContent .scrb-info'),
        template: _.template($('#scrb-outer').html()),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        render: function() {
            console.log('rendering event');
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });


    var ScribbleEmbedModel = Backbone.Model.extend({
        defaults: function() {
            return {
                Title: 'Live blog',
                Description: 'loading',
                postsCollection: []
            };
        },
        token: 'asdf',
        max: 10, // change (increase) this to get infinite scrolling but still get updates.
        url: function() {
            //return 'http://apiv1.scribblelive.com/event/' + this.id + '/all/?Token=' + this.token + '&Max=' + max + '&Order=asc&format=json';
            return '/scripts/test_data.json'
        },
        initialize: function() {
            this.postsCollection = new ScribblePosts([]);
        },
        parse: function(response) {
            if (this.postsCollection.length) {
                this.postsCollection.updateModels(response.Posts);
            } else {
                this.postsCollection.reset(response.Posts);
            }
            return _.omit(response, 'Posts');
        },
        update: function() {
            var thisModel = this;
            thisModel.fetch();
            _.delay(function() {
                thisModel.update();
            }, 10000);
        }
    });



    var scribble = new ScribbleEmbedModel({
        id: '560845'
    });
    var scribbleView = new ScribbleEmbedView({
        model: scribble
    });
    var scribblePostsView = new ScribblePostsView({
        collection: scribble.postsCollection,
        el: '#scribbleContent .scrb-posts'
    });
    scribble.update();

    window.test_model = scribble;
  
})(jQuery);