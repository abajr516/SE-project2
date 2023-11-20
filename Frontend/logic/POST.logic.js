/**
 * ==================================================================
 * POST REQUESTS
 * using form data creates body of POST request to send to API endpoint
 * ==================================================================
 */


/**
 * Creates an account
 * needs: fname, lname, email, pwd, pnum, and username
 */
async function createAccount() {
    const formData = new FormData(document.getElementById('accountForm'));
    const url = 'http://localhost:8080/account/new';
  
    try {
      const requestBody = {
        Fname: formData.get('Fname'),
        Lname: formData.get('Lname'),
        Fullname: formData.get('Fname') + formData.get('Lname'),
        Email: formData.get('Email'),
        pwd: formData.get('pwd'),
        Pnum: parseInt(formData.get('Pnum')),
        Username: formData.get('Username'),
      };
  
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.headers}`);
      }
  
      const result = await response.json();
      displayResult('accountTable', result);
    } catch (error) {
      console.error('Error during POST request:', error.message);
    }
  }
  
  
  /**
   * creates a new post
   * needs: title, descr, genre, authorID, picID
   * id is autogenerated, pic id autogenerated, use uploadImage() method to send picture, response from this contains picID
  */
  async function createPost() {
    const formData = new FormData(document.getElementById('postForm'));
    const url = 'http://localhost:8080/posts/create';
  
    try {
      let requestBody = {
        title: formData.get('title'),
        descr: formData.get('descr'),
        genre: formData.get('genre'),
        authorId: parseInt(formData.get('authorId')),
      };
  
      // Check if a file is selected
      const fileInput = document.getElementById('image');
      if (fileInput.files.length > 0) {
        // Upload the image and get the image ID
        const imageId = await uploadImage();
        // Convert the imageId to an integer
        requestBody.picId = parseInt(imageId);
      }
  
      console.table(JSON.stringify(requestBody));
  
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      displayResult('postTable', result);
    } catch (error) {
      console.error('Error during POST request:', error.message);
    }
  }
  
  

  /**
 * uploads an image to the database
 * needs: file preferably in png
 */
  async function uploadImage() {
    try {
      const fileInput = document.getElementById('image');
      const file = fileInput.files[0];
  
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('http://localhost:8080/uploads', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log('File uploaded successfully:', data[0].id);
  
      return data[0].id; // Return only the ID
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  
  /**
   * creates comment in database 
  */
  async function createNewComment() {
    const formData = new FormData(document.getElementById('commentForm'));
    const url = 'http://localhost:8080/comment/new';
  
    try {
      const requestBody = {
        postID: parseInt(formData.get('postId')),
        content: formData.get('commentContent'),
        authorId: parseInt(formData.get('commentAuthorId')),
      };
  
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      displayResult('commentTable', result);
    } catch (error) {
      console.error('Error during POST request:', error.message);
    }
  }
  
  
  /**
   * sends request to login and retrive information about user
   * needs: username OR email, and password
   * returns information about user 
   */
  async function login() {
    const formData = new FormData(document.getElementById('loginForm'));
    const url = 'http://localhost:8080/login';
  
    try {
      const requestBody = {
        username: formData.get('username'),
        password: formData.get('password'),
        email: formData.get('email'),
      };
  
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      displayResult('loginTable', result);
    } catch (error) {
      console.error('Error during POST request:', error.message);
    }
  }
  
  /**
   * Helper method to create table that shows the result of a POST request
  */
  function displayResult(tableId, results) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
  
    if (results.length === 0) {
      console.error('No results to display');
      return;
    }
  
    const keys = Object.keys(results[0]);
  
    // Header row
    const headerRow = table.insertRow(0);
    keys.forEach(key => {
      const headerCell = headerRow.insertCell(-1);
      headerCell.textContent = key;
    });
  
    // Data rows
    results.forEach(result => {
      const dataRow = table.insertRow(-1);
      keys.forEach(key => {
        const dataCell = dataRow.insertCell(-1);
        dataCell.textContent = result[key];
      });
    });
  }