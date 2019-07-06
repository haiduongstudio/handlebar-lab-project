import React from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  ActivityIndicator,
  Text,
  View,
  Switch
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

const FieldWrapper = ({ children, label, formikProps, formikKey }) => (
  <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
    <Text style={{ marginBottom: 3 }}>{label}</Text>
    {children}
    <Text style={{ color: 'red' }}>
      {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
    </Text>
  </View>
);

const StyledInput = ({ label, formikProps, formikKey, ...rest }) => {
  const inputStyles = {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 3
  };

  if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
    inputStyles.borderColor = 'red';
  }

  return (
    <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
      <TextInput
        style={inputStyles}
        onChangeText={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        {...rest}
      />
    </FieldWrapper>
  );
};

const StyledSwitch = ({ formikKey, formikProps, label, ...rest }) => {
  return (
    <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
      <Switch
        value={formikProps.values[formikKey]}
        onValueChange={value => {
          formikProps.setFieldValue(formikKey, value);
        }}
        {...rest}
      />
    </FieldWrapper>
  );
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .label('Email')
    .email()
    .required(),
  password: yup
    .string()
    .label('Password')
    .required()
    .min(2, 'Seems a bit short...')
    .max(10, 'We prefer inscure system, try a shorter password.'),
  confirmPassword: yup
    .string()
    .required()
    .label('Confirm password')
    .test('passwords-match', 'Passwords must match ya fool', function(value) {
      return this.parent.password === value;
    }),
  agreeToTerms: yup
    .boolean()
    .label('Terms')
    .test('is-true', 'Must agree to terms to continue', value => value === true)
});

export default function App() {
  return (
    <SafeAreaView style={{ marginTop: 90 }}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        }}
        onSubmit={(value, actions) => {
          alert(JSON.stringify(value));
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 1000);
        }}
        validationSchema={validationSchema}
      >
        {formikProps => (
          <React.Fragment>
            <StyledInput
              label="Email"
              formikProps={formikProps}
              formikKey="email"
              placeholder="haitin4bk@gmail.com"
              autoFocus
            />
            <StyledInput
              label="Password"
              formikProps={formikProps}
              formikKey="password"
              placeholder="password"
              secureTextEntry
            />
            <StyledInput
              label="Confirm Password"
              formikProps={formikProps}
              formikKey="confirmPassword"
              placeholder="confirm password"
              secureTextEntry
            />
            <StyledSwitch
              label="Agree to Terms"
              formikKey="agreeToTerms"
              formikProps={formikProps}
            />
            {formikProps.isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <Button title="Submit" onPress={formikProps.handleSubmit} />
            )}
          </React.Fragment>
        )}
      </Formik>
    </SafeAreaView>
  );
}
