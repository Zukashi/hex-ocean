import * as z from "zod";
export const foodTypes = ['pizza', 'soup', 'sandwich'] as const
export const formSchema = z.object({
    name: z.string().min(1, { message: 'Food name is required' }).min(3, {message:'At least 3 characters'}),
    preparation_time: z.string().regex(new RegExp('^([0-1]?\\d|2[0-3])(?::([0-5]?\\d))?(?::([0-5]?\\d))?$'), {message:'Preparation time is required'}),
    type:z.enum(foodTypes, {required_error: 'Type of food is required'}),
    spiciness_scale:z.number({invalid_type_error:'Spiciness should be of type number'}).min(1).max(10).optional(),
    slices_of_bread:z.number().min(1).optional(),
    no_of_slices:z.number().min(0).optional(),
    diameter:z.number().min(0).optional()
})

export const pizzaSchema = formSchema.extend({
    no_of_slices:z.number().min(1, {message:'There should be atleast one slice'}),
    diameter:z.number()
});
export const soupSchema = formSchema.extend({
    spiciness_scale:z.number().min(1).max(10),
});
export const sandwichSchema = formSchema.extend({
    slices_of_bread:z.number().min(1)
})
