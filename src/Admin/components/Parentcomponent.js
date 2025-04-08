// ParentComponent.jsx
import { Formik, Form } from 'formik';
import CreateSubadmin from '../components/subadmin/CreateSubadmin';
 

const ParentComponent = () => {
  return (
    <Formik
      initialValues={{
        profile_image: '',
        // Add other fields as needed
      }}
      onSubmit={(values) => {
        console.log('Submitted:', values);
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <CreateSubadmin setFieldValue={setFieldValue} />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default ParentComponent;
