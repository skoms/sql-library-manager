'use strict';
const Sequelize = require('sequelize');
const { Model } = Sequelize;
const date = new Date();
const currentYear = date.getFullYear(); // Getting year to validate the 'year'


// Export the 'Book' model
module.exports = (sequelize) => {
  class Book extends Model { };
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      allowEmpty: false,
      validate: {
        notNull: {
          msg: 'Please enter the title of the Book'
        },
        notEmpty: {
          msg: 'Please enter the title of the Book'
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      allowEmpty: false,
      validate: {
        notNull: {
          msg: 'Please enter the author of the Book'
        },
        notEmpty: {
          msg: 'Please enter the author of the Book'
        }
      }
    },
    genre: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: {
          msg: 'Please enter a valid year only using numbers'
        },
        max: {
          args: currentYear,
          msg: 'Please provide a valid year'
        },
        min: {
          args: -2100,
          msg: 'The first book ever written was "Epic of Gilgamesh", in 2100 BCE, I doubt you have something older'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};