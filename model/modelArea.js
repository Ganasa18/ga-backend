module.exports = (sequelize, Sequelize) => {
  const Area = sequelize.define("m_area", {
    area_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value === null || value == "") {
            throw new Error("area name can't be null or empty");
          }
        },
      },
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
  // Area.sync({});
  return Area;
};
