import {Controller, SubmitHandler, useForm} from "react-hook-form";
import { LocalizationProvider, TimeField} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import './form.css';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {zodResolver} from "@hookform/resolvers/zod";
import {formSchema, pizzaSchema, sandwichSchema, soupSchema} from "./schema";
import { motion} from 'framer-motion'




export interface FormValues  {
    preparation_time:string,
    name:string,
    type: 'pizza' | 'sandwich' | 'soup',
    spiciness_scale?:number,
    slices_of_bread?:number,
    no_of_slices?:number,
    diameter?:number
}
export const Form = () => {
    const {register, handleSubmit, formState : {errors}, control, watch, getValues} =  useForm<FormValues>({
        resolver: zodResolver(formSchema),

    });
    const submitForm:SubmitHandler<FormValues> = async (data) => {
        console.log(data)
        let schema;
        switch(data.type){
            case 'pizza':
                schema = pizzaSchema;
                break;
            case 'soup':
                schema = soupSchema;
                break
            case 'sandwich':
                schema = sandwichSchema

        }
        try{
            await schema.safeParseAsync(data);
            const res = await fetch('https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/', {
                method:"POST",
                body:JSON.stringify(data),
                headers:{
                    'content-type':'application/json'
                }
            });
            const data2 = await res.json();
            console.log(data2)
        }catch(err){
            console.log(err)
        }
    }
    return (<>
        <div className='form-container'>
            <form onSubmit={handleSubmit(submitForm)} autoComplete={'off'}>
                <div className="input-container">
                    <TextField label={'Pick a name'} variant={'outlined'} type="text" {
                        ...register('name')
                    }/>
                    <p className='error-text'>{errors.name?.message}</p>
                </div>
               <div> <LocalizationProvider dateAdapter={AdapterDayjs}>
                   <Controller
                       control={control}
                       name="preparation_time"
                       rules={{

                       }}
                       render={({ field: { ref, onBlur, name, ...field } }) => (
                           <TimeField
                               format="HH:mm:ss"
                               label="Preparation Time"
                               {...register('preparation_time')}

                           />
                       )}
                   />
                   <p className='error-text'>{errors?.preparation_time?.message}</p>
               </LocalizationProvider></div>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        {...register('type')}
                        label="Type"
                        defaultValue={""}
                    >
                        <MenuItem value={'pizza'}>Pizza</MenuItem>
                        <MenuItem value={'soup'}>Soup</MenuItem>
                        <MenuItem value={'sandwich'}>Sandwich</MenuItem>
                    </Select>
                </FormControl>

                   {(watch('type')) === 'soup' && <motion.div initial={{opacity:1, x:300}} animate={{opacity:1, x:0}} >
                       <TextField
                           fullWidth
                           label="Spiciness scale(1-10)"
                           defaultValue={0}
                           type="number"
                           {...register('spiciness_scale', {
                               valueAsNumber:true
                           })}
                       />
                       <p className='error-text'>{errors.spiciness_scale?.message}</p>
                   </motion.div>} {watch('type') === 'sandwich' && <motion.div initial={{opacity:1, x:300}} animate={{opacity:1, x:0}} >
                       <TextField
                           fullWidth
                           defaultValue={1}
                           label="Amount of a bread slices"
                           InputProps={{ inputProps: { min: 1} }}
                           type="number"
                           {...register('slices_of_bread', {
                               valueAsNumber:true
                           })}
                       />
                       <p className='error-text'>{errors.slices_of_bread?.message}</p>
                   </motion.div>} {watch('type') === 'pizza' &&<> <motion.div initial={{opacity:1, x:300}} animate={{opacity:1, x:0}} >
                       <TextField
                           fullWidth
                           label="Amount of pizza slices"
                           InputProps={{ inputProps: { min: 0} }}
                           type="number"
                           {...register('no_of_slices', {
                               valueAsNumber:true
                           })}
                       />
                       <p className='error-text'>{errors.no_of_slices?.message}</p>
                   </motion.div>
                       <motion.div initial={{opacity:1, x:300}} animate={{opacity:1, x:0}} exit={{x:-300, opacity:1}}>
                           <TextField
                               fullWidth
                               label="Pizza diameter"
                               InputProps={{ inputProps: { min: 0} }}
                               type="number"
                               {...register('diameter', {
                                   valueAsNumber:true
                               })}
                           />
                           <p className='error-text'>{errors.diameter?.message}</p>
                       </motion.div></> }
                <Button type={"submit"}>Submit</Button>
            </form>
        </div></>)
}