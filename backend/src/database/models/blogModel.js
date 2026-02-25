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
        authorId:{
            type:DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID of the logged-in admin who created the blog'
        },
        authorImage:{
            type:DataTypes.STRING,
            allowNull: true,
        },
        blogStatus:{
            type:DataTypes.ENUM('draft', 'published', 'archived'),
            allowNull: false,
            defaultValue: 'draft',
        },
        blogImage:{
            type:DataTypes.STRING,
            allowNull: true,
            comment: 'Cover/featured image uploaded by author'
        },
        blogCategory:{
            type: DataTypes.ENUM('admission', 'result', 'academic', 'events', 'sports', 'achievements', 'announcements', 'general'),
            allowNull: false,
            defaultValue: 'general',
        },
        audience:{
            type: DataTypes.ENUM('public', 'students_parents', 'teachers', 'internal'),
            allowNull: false,
            defaultValue: 'public',
            comment: 'Who can view this blog post'
        },
        publishedDate:{
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Date when blog was published'
        },
        views:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of views'
        },
        tags:{
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Comma-separated tags'
        }
    });
    return Blog;
}
module.exports = blogModel;
