let app = require('express')();


require('./database/connection');



app.get('/', (req, res) => {
  res.send('Hello Dambar!'); 
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
