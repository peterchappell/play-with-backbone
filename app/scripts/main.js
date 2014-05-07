'use strict';

(function($){


    var ScribblePost = Backbone.Model.extend({
        defaults: function() {
            return {
                Content: '(empty)'
            }
        }
    });


    var ScribblePostView = Backbone.View.extend({
        tagName: 'div',
        className: 'post',
        template: _.template($('#scrb-post').html()),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            console.log('render post');
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });


    var ScribblePostsView = Backbone.View.extend({
        el: $('#scribbleContent .scrb-postsLists'),
        initialize: function() {
            //this.listenTo(this.collection, 'add remove sort', this.testSet);
            this.listenTo(this.collection, 'change', this.render);
            this.render();
        },
        render: function() {
            console.log('rendering collection');
            /*var container = document.createDocumentFragment();
            this.collection.each(function(post) {
                //var postView = new ScribblePostView({
                //    model: post
                //});
                //container.appendChild(postView.render().el);
                container.append('[hello] ');
            }, this );*/
            this.$el.append('<p>Collection!</p>');
        },
        testSet: function() {
            console.log('collection has been changed');
        }
    });


    var ScribblePosts = Backbone.Collection.extend({
        model: ScribblePost
    });


    var ScribbleEmbedView = Backbone.View.extend({
        el: $('#scribbleContent .scrb-info'),
        template: _.template($('#scrb-outer').html()),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        render: function() {
            console.log('rendering whole page');
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
        initialize: function() {
            this.postsCollection = new ScribblePosts(this.get('Posts'));
            this.on('change', this.updatePosts);
        },
        url: function() {
            //return 'http://apiv1.scribblelive.com/event/' + this.id + '/page/last/?Token=' + this.token + '&Max=100&Order=asc&format=json';
            return '/scripts/test_data.json'
        },
        update: function() {
            var thisModel = this;
            thisModel.fetch();
            _.delay(function() {
                thisModel.update();
            }, 10000);
        },
        updatePosts: function() {
            console.log('updating posts');
            this.postsCollection.set(this.get('Posts'));
        }
    });



    var scribble = new ScribbleEmbedModel({
        id: '560845'
    });
    scribble.update();
    var scribbleView = new ScribbleEmbedView({
        model: scribble
    });
    var scribblePostsView = new ScribblePostsView({
        collection: scribble.postsCollection
    });

    window.test_model = scribble;
  
})(jQuery);