// Write your package code here!

Powa = function(author){

    this.version = '0.0.1';
    this.author = author;
    this.powaDB = new Meteor.Collection('powaDB');

    return this;

};