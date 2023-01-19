const bcrypt = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      username: {
        unique: true,
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
          customValidator(value) {
            if (value === null || value === "") {
              throw new Error("username can't be null or empty");
            }
          },
        },
      },
      firstName: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      phoneNumber: {
        unique: true,
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
          customValidator(value) {
            if (value === null || value === "") {
              throw new Error("phone number can't be null or empty");
            }
          },
        },
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "password is required",
          },
          notEmpty: {
            msg: "please provide a password",
          },
        },
      },
      area: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      departement: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      role: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      plate_car: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      car_1: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      car_2: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      car_3: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      car_4: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    },
    {
      freezeTableName: true,
      hooks: {
        beforeCreate: (User) => {
          const salt = bcrypt.genSaltSync(10);
          User.password = bcrypt.hashSync(User.password, salt);
        },
      },
      instanceMethods: {
        validatePassword: (password) => {
          return bcrypt.compareSync(password, this.password);
        },
      },
    }
  );
  // User.sync({ force: true });
  return User;
};
