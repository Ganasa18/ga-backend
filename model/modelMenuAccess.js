module.exports = (sequelize, Sequelize) => {
  const MenuAccess = sequelize.define("m_menu_access", {
    menu_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value === null || value == "") {
            throw new Error("menu name can't be null or empty");
          }
        },
      },
    },
    user_id: {
      type: Sequelize.INTEGER,
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
  return MenuAccess;
};
