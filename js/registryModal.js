if (Meteor.isClient) {

    Template.registryModal.rendered = function () {
        $(".registry-image").tooltip({placement: 'bottom'});
    };
}