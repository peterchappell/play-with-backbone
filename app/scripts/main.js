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
        template: _.template($('#post-template').html()),
        model: ScribblePost,
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

    
    var ScribblePosts = Backbone.Collection.extend({
        model: ScribblePost
    });
    
    
    var ScribblePostsView = Backbone.View.extend({
        template: _.template($('#posts-template').html()),
        initialize: function() {
            //this.listenTo(this.collection, 'add remove sort', this.testSet);
            this.listenTo(this.collection, 'reset', this.render);
            this.render();
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
        },
        testSet: function() {
            console.log('collection has been changed');
        }
    });
    
  
    var ScribbleEvent = Backbone.Model.extend({
        defaults: function() {
            return {
                Title: 'Live blog',
                Description: 'loading'
            };
        },
        token: 'asdf',
        url: function() {
            //return 'http://apiv1.scribblelive.com/event/' + this.id + '/page/last/?Token=' + this.token + '&Max=100&Order=asc&format=json';
            return '/scripts/test_data.json'
        },
        initialize: function() {
            this.postsCollection = new ScribblePosts([]);
        },
        parse: function(response) {
            this.postsCollection.set(response.Posts);
            return {
                Title: response.Title,
                Description: response.Description
            };
        },
        update: function() {
            var thisModel = this;
            thisModel.fetch();
            _.delay(function() {
                thisModel.update();
            }, 10000);
        }
    });
    
    
    var ScribbleEventView = Backbone.View.extend({
        el: $('#scribbleContent'),
        template: _.template($('#event-template').html()),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.model.update();
        },
        render: function() {
            console.log('rendering whole page');
            this.$el.html(this.template(this.model.toJSON()));
            this.postsView = new ScribblePostsView({
                collection: this.model.postsCollection,
                el: $('.postsList', this.$el)
            });
            return this;
        }
    });
    
    

    var ScribbleEventModel = new ScribbleEvent({
        id: '560845'
    });
    var AppView = new ScribbleEventView({
        model: ScribbleEventModel
    });
  
})(jQuery);