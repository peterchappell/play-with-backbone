/**
 * A set of extensions to Backbone for use in this project
 * */

(function(){

    Backbone.Collection.prototype.updateModels = function(newData) {
        var thisCollection = this;

        // go through the new data to see if the model already exists
        // if it exists we update it, otherwise we add a new model to the collection
        _.each(newData, function (modelData) {
            var thisModel = thisCollection.get(modelData.Id);
            if (thisModel) {
                thisModel.set(modelData);
            } else {
                thisCollection.add(modelData);
            }
        });

        // check for items that should have been removed and remove them
        if (thisCollection.length > newData.length) {
            this.cleanUpCollection(newData);
        }

        return thisCollection;
    };

    Backbone.Collection.prototype.cleanUpCollection = function(newData) {
        var thisCollection = this,
            newDataIds = _.pluck(newData, 'Id'),
            collectionIds, 
            idsToRemove;

        // get the Ids from the collection
        collectionIds =  thisCollection.map(function(model){
            return model.id;
        });
        // compare against those in the new data
        idsToRemove = _.difference(collectionIds, newDataIds);
        
        console.log('remove these', idsToRemove);
        
        // get them and remove them
        _.each(idsToRemove,function(id){
            var itemToRemove = thisCollection.get(id);
            thisCollection.remove(itemToRemove);
        });

        return thisCollection;
    };

}).call(this);
