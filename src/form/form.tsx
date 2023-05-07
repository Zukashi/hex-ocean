import {Controller, SubmitHandler, useForm} from "react-hook-form";
import { LocalizationProvider, TimeField} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import './form.css';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";

const foodTypes = ['pizza', 'soup', 'sandwich'] as const

const formSchema = z.object({
    name: z.string().min(1, { message: 'Food name is required' }),
    preparation_time: z.string().regex(new RegExp('^(?:(?:([01]?\\d|2[0-3]):)?([0-5]?\\d):)?([0-5]?\\d)$'), {message:'Preparation time is required'}),
    type:z.enum(foodTypes, {required_error: 'Type of food is required'}),
    spiciness_scale:z.number().min(1).max(10),
})

const pizzaSchema = formSchema.extend({
    no_of_slices:z.number().min(1, {message:'There should be atleast one slice'}),
    diameter:z.number()
});
const soupSchema = formSchema.extend({
    spiciness_scale:z.number().min(1).max(10),
});
const sandwichSchema = formSchema.extend({
    slices_of_bread:z.number().min(1)
})
export interface FormValues  {
    preparation_time:string,
    name:string,
    type: 'pizza' | 'sandwich' | 'soup',
    spiciness_scale:number
}
export const Form = () => {
    const {register, handleSubmit, formState : {errors}, control, reset, watch} =  useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });
    console.log(errors)
    const submitForm:SubmitHandler<FormValues> = async (data) => {
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
            await schema.parseAsync(data)
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
                   {/*<TimeField*/}
                   {/*    label="Preparation time"*/}
                   {/*    name='preparation_time'*/}
                   {/*    format="HH:mm:ss"*/}
                   {/*    value={value}*/}
                   {/*    onChange={(newValue) => setValue(newValue)}*/}
                   {/*/>*/}
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
                               defaultValue={null}
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
                {(watch('type')) === 'soup' ? <div>
                    <TextField
                        fullWidth
                        label="Times"
                        type="number"
                        {...register('spiciness_scale', {
                            valueAsNumber:true
                        })}
                    />
                    <p className='error-text'>{errors.spiciness_scale?.message}</p>
                </div>: null}
                <Button type={"submit"}>Submit</Button>
            </form>
        </div></>)
}