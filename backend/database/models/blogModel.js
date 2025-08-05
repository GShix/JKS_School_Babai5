const blogModel = (sequelize, DataTypes) => {
    const Blog = sequelize.define("blog",{
        blogTitle:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        blogDescription:{
            type:DataTypes.TEXT,
            allowNull: false,
        },
        blogAuthor:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        blogStatus:{
            type:DataTypes.STRING,
            allowNull: false,
            defaultValue: 'published',
        },
        blogImage:{
            type:DataTypes.STRING,
            allowNull: true,
        },
    });
    return Blog;
}
module.exports = blogModel;
//create raw data for the input of blog in json for postman
// Example JSON data for creating a blog post
// {
//     "blogTitle": "First Blog",
//     "blogDescription": "This is the first blog",
//     "blogAuthor": "John Doe",
//     "blogStatus": "published",
//     "blogImage": "https://example.com/image1.jpg"
// }
