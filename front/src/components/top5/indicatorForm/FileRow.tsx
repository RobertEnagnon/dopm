import { Controller } from "react-hook-form";
import {Alert, Col, Input, InputGroup, InputGroupText, Row} from "reactstrap";
import {useEffect} from "react";

interface FileRowProps {
    errors: any;
    register: any,
    control: any
}

export const FileRow = ({
    errors,
    register,
    control
}: FileRowProps) => {
    useEffect(() => {
        register('fileName', {
            validate: (value: string) =>
                value?.trim()?.length > 0
                 || 'Vous devez saisir un lien.'
        });
    },[register])

    return (
        <Row style={{ marginTop: 20 }}>
            <Col md={5}>
                {errors.fileName && (
                    <Alert color='danger' style={{ padding: '0.5rem' }}>
                        {errors.fileName.message}
                    </Alert>
                )}
                <InputGroup>
                    <InputGroupText html="fileName">Lien :</InputGroupText>
                    <Controller
                        name='fileName'
                        control={control}
                        render={({ field }) => (
                            <Input
                                type='text'
                                id='file'
                                {...field}
                            />
                        )}
                    />
                </InputGroup>
            </Col>
        </Row>
    )
}