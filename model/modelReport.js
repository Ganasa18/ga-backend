module.exports = (sequelize, Sequelize) => {
  const Report = sequelize.define("m_report", {
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
    plate_car: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    car_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    departement: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    area: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    km_awal: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    km_akhir: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    km_total: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    picture_1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    picture_2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    location: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    newLocation: {
      type: Sequelize.BOOLEAN,
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
    locationDate: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
  // Report.sync({ force: true });
  return Report;
};
