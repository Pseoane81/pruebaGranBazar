module.exports=function(sequelize,dataTypes){
    const alias='Category';

    const cols={
        id:{
            type:dataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true 
        },
        category:{
            type:dataTypes.STRING
        }
    }
    
    const config={
        tableName:'categories',
        timestamps:false,
        underscored: true
    }
    const Category=sequelize.define(alias,cols,config);
    Category.associate=function(models) {
        Category.belongsToMany(models.Productos, {
            as:"products",
            through:"ProductCategory",
            foreignKey:"product_id",
            otherKey:"category_id",
            timestamps:false
        })
    }
    return Category;
}