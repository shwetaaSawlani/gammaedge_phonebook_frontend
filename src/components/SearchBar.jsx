

import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, setPaginationParams } from '../features/contacts/contactSlice';
import { TextField, InputAdornment, Tooltip, IconButton } from '@mui/material';

const SearchBar = () => {

    const dispatch = useDispatch();

    const { currentPage, itemsPerPage, activeLabel } = useSelector((state) => state.contacts);

    const [searchTerm, setSearchTerm] = useState('');

    const debounceTimerRef = useRef(null);





    const triggerSearchFetch = useCallback((query, label) => {
        console.log("Dispatching fetchContacts with: searchTerm:", query, "label:", label);
        dispatch(fetchContacts({ page: 1, limit: itemsPerPage, searchTerm: query, label: label || undefined, }));
    },
        [dispatch, itemsPerPage]);



    const handleSearchChange = (e) => {

        const query = e.target.value;

        setSearchTerm(query);




        console.log("SearchBar: Input changed to:", query);




        if (debounceTimerRef.current) {

            clearTimeout(debounceTimerRef.current);

        }



        debounceTimerRef.current = setTimeout(() => {



            console.log("SearchBar: Debounce finished. Initiating search for:", query);



            dispatch(setPaginationParams({ searchTerm: query, page: 1 }));


            triggerSearchFetch(query, activeLabel);

        }, 500);

    };



    const handleSearchButtonClick = () => {

        if (debounceTimerRef.current) {

            clearTimeout(debounceTimerRef.current);

        }




        dispatch(setPaginationParams({

            searchTerm: searchTerm,

            page: 1

        }));



        triggerSearchFetch(searchTerm, activeLabel);

    };





    useEffect(() => {


        return () => {

            if (debounceTimerRef.current) {

                clearTimeout(debounceTimerRef.current);

            }

        };

    }, []);



    return (

        <div>

            <TextField

                fullWidth

                variant="outlined"

                placeholder="Search by name..."

                value={searchTerm}

                onChange={handleSearchChange}

                InputProps={{

                    endAdornment: (

                        <InputAdornment position="end">

                            <Tooltip title="search">

                                <IconButton onClick={handleSearchButtonClick}>

                                    <SearchIcon />

                                </IconButton>

                            </Tooltip>

                        </InputAdornment>

                    ),

                }}

            />

        </div>

    );

};



export default SearchBar;