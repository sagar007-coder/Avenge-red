{
    // method to submit tha form data for post using ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');

         newPostForm.submit(function(e){
             e.preventDefault();


             $.ajax({
                 type:'post',
                 url:'/posts/create',
                 data: newPostForm.serialize(),
                 success: function(data){
                     let newPost = newPostDom(data.data.post);
                     $('#posts-list-container>ul').prepend(newPost); 


                }, error: function(error){
                     console.log(error.responseText);
                }
            });
           
        });
    }


    //method to create a post in DOM
    let newPostDom =  function(post){
        return $(`<li  id="post-${post._id }"style="display: block;    text-align: center;">  
        <p>
           
            <small>
                <a class="delete-post-button" href="/posts/destroy/${ post.id }">del</a>
            </small>
            
            ${ post.content }
            <br>
            <small>
              ${ post.user.name }
            </small>
        </p>
        <div class="post-comments">
            
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type Here to add comment..." required>
                    <input type="hidden" name="post" value="${ post._id }" >
                    <input type="submit" value="Add Comment">
                </form>
    
            
    
            <div class="post-comments-list">
                <ul id="post-comments-${ post._id }">
                   
                </ul>
            </div>
        </div>
        
    </li>`)
    }

    createPost();
}