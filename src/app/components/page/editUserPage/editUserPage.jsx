import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../api";
import Qualities from "../../ui/qualities";
import { useHistory } from "react-router-dom";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import TextField from "../../common/form/textField";

const EditUserPage = ({ match }) => {
    const userId = match.params.userId
    const history = useHistory();
    const [professions, setProfession] = useState([]);
    const [qualities, setQualities] = useState([]);
    let [data, setData] = useState({
        name: "",
        email: "",
        sex: "",
        profession: {},
        qualities: []
    });
    const getProfessionById = (id) => {
        for (const prof of professions) {
            if (prof.value === id) {
                return { _id: prof.value, name: prof.label };
            }
        }
    };
    useEffect(() => {api.users.getById(userId).then(({profession, qualities, ...data}) =>
            setData(prevState => ({...prevState, ...data, qualities: getNameQualities(qualities),
                profession: profession._id}
            )));
    }, [])
    useEffect(() => {
        api.professions.fetchAll().then((data) => {
        const professionsList = Object.keys(data).map((professionName) => ({
            label: data[professionName].name,
            value: data[professionName]._id
        }));
        setProfession(professionsList);
    });
        api.qualities.fetchAll().then((data) => {
            const qualitiesList = Object.keys(data).map((optionName) => ({
                value: data[optionName]._id,
                label: data[optionName].name,
                color: data[optionName].color
            }));
            setQualities(qualitiesList);
        });}, [])


    const getNameQualities2 = (elements) => {
        const qualitiesArray = [];
        elements.forEach(element => {
            qualitiesArray.push({
                id: element.value,
                name: element.label,
                color: element.color
            });
        })
        return qualitiesArray;
    }

        const getNameQualities = (elements) => {
            const qualitiesArray = [];
            elements.forEach(element => {
                qualitiesArray.push({
                    value: element._id,
                    label: element.name,
                    color: element.color
                });
            })
            return qualitiesArray;
        }

    const handleChange = (target) => {
        console.log(target)
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let { profession, qualities } = data;
        console.log({
            ...data,
            profession: getProfessionById(data.profession),
            qualities: getNameQualities2(data.qualities)
        });
        data = {
            ...data,
            profession: getProfessionById(data.profession),
            qualities: getNameQualities2(data.qualities)
        };

        api.users.update(userId, data)
        history.push(`/users/${userId}`)
    };
    const getProfessionById2 = (id) => {
        for (const prof of professions) {
            if (prof.value === id) {
                return prof.label
            }
        }
    };
    if (data) {
        return (
            <div>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Имя"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Электронная почта"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                />
                <SelectField
                    label="Профессия"
                    defaultOption={getProfessionById2(data.profession)}
                    options={professions}
                    name="profession"
                    onChange={handleChange}
                    value={data.profession._id}
                />
                <RadioField
                    options={[
                        { name: "Male", value: "male" },
                        { name: "Female", value: "female" },
                        { name: "Other", value: "other" }
                    ]}
                    value={data.sex}
                    name="sex"
                    onChange={handleChange}
                    label="Выберите ваш пол"
                />
                <MultiSelectField
                    key={data.qualities._id}
                    options={qualities}
                    onChange={handleChange}
                    defaultValue={data.qualities}
                    name="qualities"
                    label="Выберите ваши качества"
                />
                <button
                    className="btn btn-primary w-100 mx-auto"
                    type="submit"
                >
                    Submit
                </button>
            </form>
                </div>)
    } else {
        return <h1>Loading</h1>;
    }
};

EditUserPage.propTypes = {
    match: PropTypes.object
};

export default EditUserPage;