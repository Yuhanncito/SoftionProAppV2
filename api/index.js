export const BASEURL = 'https://softion-api-v3.vercel.app/api';


export const sendImagen = async (token , imagen64) => {
    try {
        const response = await fetch(`${BASEURL}/auth/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                imagen: imagen64
            }), // Convierte los datos a JSON
        });
        const data = await response.json()

        if( data.message !== 'ok' ){
            return { success: false, message: data.message };
        }
        return { success: true, data: data }
    }

    catch (error) {
        return { success: false, message: 'Error en la solicitud de registro' };
    }
}

export const RegisterFunction = async (data) => {
    try {
        const response = await fetch(`${BASEURL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Convierte los datos a JSON
        });

        const result = await response.json(); // Parsear el resultado
        
        if(result.message !== 'ok'){
            return { success: false, message: result.message }; 
        }

        // Si todo sale bien, retornamos el resultado
        return { success: true, data: result };

    } catch (error) {
        return { success: false, message: 'Error en la solicitud de registro' };
    }
};

export const getUser = async (email) => {
    try {
        const response = await fetch(`${BASEURL}/auth/${email}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json(); // Parsear el resultado

        if (result.message !== 'ok') {
            
            return { success: false, message: 'Error al obtener el usuario' }; // Maneja el error si la respuesta no es exitos
        }

        // Esto, en la parte de result, retorna key y question, que "key" seria la clave de la pregunta y "question" la pregunta en sí

        return { success: true, data: result.data[0] };

    } catch (error) {
        console.error("Error en la solicitud:", error);
        return { success: false, message: 'Error en la solicitud de usuario' };
    }
};

export const sendEmail = async (data) => {
    try{
        const response = await fetch(`${BASEURL}/auth/forgotPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        if(result.message !== 'correcto'){
            return {success:false, message:'Error al enviar correo'}
        }

        return { success:true, data: result }

    }catch(error){
        return { success:false, message: "Ah ocurrido un error en el Email" }
    }
}

export const VerifyQuestion = async (data) => {
    try{
        const response = await fetch(`${BASEURL}/auth/secret`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        if(result.message !== 'ok'){
            return {success:false, message:'Error al validar datos'}
        }
        return { success : true }

    }catch(error){
        return { success:false, message: "Ah ocurrido un error en el Email" }
    }
}

export const updatePassword = async (token, data) => {
    try{
        const response = await fetch(`${BASEURL}/auth/forgotPassword/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        if(result.message !== 'ok'){
            return {success:false, message:'Error al validar datos'}
        }
        return { success : true, token:result.token }
    }catch(error){
        return { success:false, message: "Ah ocurrido un error en el Email" }
    }
}  

export const getUserData = async (token) => {
    try {
    const response = await fetch(`${BASEURL}/auth/`, {
        headers: {
        'Content-Type': 'application/json',
          'x-access-token': token // Pasar correctamente el token en el header
        }
    });
    const result = await response.json();
    
      // Revisa cómo está estructurada la respuesta
    console.log(result);

    if (result && result.user) {
        return { user: result.user }; // Retorna solo el usuario si está presente
    } else {
        return { error: 'No se pudo obtener el usuario' };
    }
    } catch (error) {
    console.error('Error en getUserData:', error);
    return { error: 'Error al obtener los datos del usuario' };
    }
};

export const getWorkSpaces = async (data) => {
    try{
        const response = await fetch(`${BASEURL}/workspace`, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': data
            }
        })
        const result = await response.json()
        return result
    }catch(error){
        console.log(error)
        return {}
    }
}

export const getWorkSpacesById = async (data, id) => {
    try{
        const response = await fetch(`${BASEURL}/workspace/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': data
            }
        })
        const result = await response.json()
        return result
    }catch(error){
        console.log(error)
        return {}
    }
}

export const getProjects = async (user, id) => {
    try{
        const response = await fetch(`${BASEURL}/projects/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user
            }
        })
        const result = await response.json()
        return result.data
    }catch(error){
        console.log(error)
        return {}
    }
}

export const createNewProject = async (user, data) => {
    try{
        const response = await fetch(`${BASEURL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        return result
    }catch(error){
        console.log(error)
        return {}
    }
}

export const deleteProject = async (user, id, idWorkspace) => {
    try{
        const response = await fetch(`${BASEURL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user
            },
            body: JSON.stringify({
                workspaceid : idWorkspace
            })
        })
        const result = await response.json()
        return result
    }catch(error){
        console.log(error)
        return {}
    }
}

export const acceptInvitation = async (user, token) => {
    try{
        const response = await fetch(`${BASEURL}/invitation/${user}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
        const result = await response.json()
        console.log(result)
        return result
    }catch(error){
        console.log(error)
        return {}
    }
}

export const getInvitations = async (user, token) => {
    try {
    console.log(`Fetching invitations for user: ${user} with token: ${token}`);
    const response = await fetch(`${BASEURL}/invitation/${user}`, {
        headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
        }
    });
    const result = await response.json();
    console.log('Invitations result:', result);
    return result;
    } catch (error) {
    console.log('Error fetching invitations:', error);
    return {};
    }
};

export const sendInvitation = async (user, data) => {
    try{
        const response = await fetch(`${BASEURL}/invitation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        console.log(result)
        return result 
    }catch(error){
        console.log(error)
        return {}
    }
}

export const getTasks = async (user, id) => {
    try{
        const response = await fetch(`${BASEURL}/task/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user
            }
        })
        const result = await response.json()
        console.log(result)
        return result
    }catch(error){
        console.log(error)
        return {}
    }
}

export const getTaskById = async (user, id) => {
    try{
        const response = await fetch(`${BASEURL}/task/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user
            }
        })
        const result = await response.json()
        return result
    }catch(error){
        console.log(error)
        return {}
    }
}

export const insertNewTask = async (user, data) => {
    try{
        const response = await fetch(`${BASEURL}/task/newTask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user
            },
            body: JSON.stringify(data)
        })
        
        const result = await response.json()
        return result
    }catch(error){
        console.log(error)
        return {}
    }
} 

export const deleteTask = async (token, id, workspaceid) => {
    
    const body = {
        workspaceid:workspaceid
    }

    try{
        const response = await fetch(`${BASEURL}/task/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(body)
        })
        const result = await response.json()
        console.log(result)
        return result
    }catch(error){
        console.log(error)
        return {}
    }
}

export const updateTask = async (user, data) => {
    try{
        const response = await fetch(`${BASEURL}/task/${data._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        console.log(result)
        return result
    }catch(error){
        console.log(error)
        return {}
    }
}