import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";

import { api } from "../utils/api";

type Inputs = {
  name: string;
  emailId: string;
  concern: string;
};

const Support: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const createSupport = api.support.createSupportTicket.useMutation();

  const onSubmit: SubmitHandler<Inputs> = (data: any) => {
    console.log(data);
    try {
      createSupport.mutate(data);
    } catch (error) {
      //TODO: make this better
      alert("Please login and try again");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Name" {...register("name", { required: true })} />
      {errors.name && <span>This field is required</span>}

      <input placeholder="Email" {...register("emailId", { required: true })} />
      {errors.emailId && <span>This field is required</span>}

      <textarea
        placeholder="Please enter your concern here and someone from our team will get back to you soon."
        {...register("concern", { required: true })}
      />
      {errors.concern && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
};

export default Support;
