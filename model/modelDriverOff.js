module.exports = (sequilize, Sequelize) => {
  const DriverOff = sequilize.define("m_driver_off", {
    user_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value === null || value == "") {
            throw new Error("user name can't be null or empty");
          }
        },
      },
    },
    departement: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value === null || value == "") {
            throw new Error("departement can't be null or empty");
          }
        },
      },
    },
    area: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    remark: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    assign_by: {
      type: Sequelize.STRING,
      allowNull: true,
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
  });
  //   DriverOff.sync({ force: true });
  return DriverOff;
};
