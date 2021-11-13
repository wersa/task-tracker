import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import Button from './Button'
// import React from 'react' 
// we don't need it anymore

const Header = ({title, onAdd, showAdd}) => {
    const location = useLocation()
    return (
        <header className='header'>
            <h1>{title}</h1>
           {location.pathname === '/' && <Button color={showAdd ?'black' : 'green'} text={showAdd ? 'Hide' : 'Add'} onClick={onAdd} />}
        </header>
    )
}

Header.defaultProps = {
    title: 'tasks trackerrr'
}

Header.propTypes = {
    title: PropTypes.string,
}

// CSS in JS

// const headingStyle = {
//     color: 'red',
//     background: 'black'

// }

export default Header
