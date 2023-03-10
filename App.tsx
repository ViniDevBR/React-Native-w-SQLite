import { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native'
import * as SQL from './src/services/schemas'
import { ICar } from './src/services/schemas'

function ListCard(props: ICar) {
  return(
    <View style={styles.listCard}>
      <Text style={{ color: 'white' }}>{props.brand}</Text>
      <Text style={{ color: 'white' }}>{props.model}</Text>
      <Text style={{ color: 'white' }}>{props.hp}</Text>
    </View>
  )
}

export default function App() {
  const [refresh, setRefresh] = useState<boolean>(true)
  const [fullList, setFullList] = useState<ICar[]>([])
  const [marca, setMarca] = useState<string>('')
  const [hp, setHp] = useState<string>('')
  const [modelo, setModelo] = useState<string>('')
  const [deleteCar, setDeleteCar] = useState<string>('')

  async function getFullListOfCars() {
    SQL.all()
      .then((data: any) => setFullList(data))
      .catch(error => console.log(error))
  }

  function AddNewCar() {
    SQL.create({
      id: (Math.random() * 1000).toString(),
      brand: marca,
      hp: Number(hp),
      model: modelo
    })
      .catch(error => console.log(error))
    setMarca('')
    setModelo('')
    setHp('')
    setRefresh(!refresh)
  }

  function handleRemoveCar() {
    SQL.find(deleteCar)
      .then(item => console.log(item))
      .catch(error => console.log(error))

    setDeleteCar('')
    setRefresh(!refresh)

  }

  useEffect(() => {
    getFullListOfCars()
  },[refresh])

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={{ width: '90%' }}>
        <Text style={{ color: '#FFF' }}>Crie o seu carro</Text>
        <View style={{ paddingBottom: 10 }}>
          <Text style={{ color: '#FFF' }}>MARCA:</Text>
          <TextInput style={styles.inputs} onChangeText={setMarca} value={marca} placeholder='Nome da marca' placeholderTextColor='#f0f'/>
        </View>
        <View style={{ paddingBottom: 10 }}>
          <Text style={{ color: '#FFF' }}>Qtd de cavalos:</Text>
          <TextInput style={styles.inputs} onChangeText={setHp} value={hp} placeholderTextColor='#f0f' placeholder='Cavalos'/>
        </View>
        <View style={{ paddingBottom: 10 }}>
          <Text style={{ color: '#FFF' }}>Modelo:</Text>
          <TextInput style={styles.inputs} onChangeText={setModelo} value={modelo} placeholderTextColor='#f0f' placeholder='Modelo'/>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={AddNewCar}>
          <Text style={{ color: '#FFF' }}>Adicionar</Text>
        </TouchableOpacity>

        <View>
          <Text style={{ color: '#FFF' }}>Remover um carro pelo id:</Text>
          <TextInput style={styles.inputs} onChangeText={setDeleteCar} value={deleteCar} placeholderTextColor='#f0f' placeholder='valor do ID' />
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveCar}>
            <Text style={{ color: '#FFF' }}>Remover</Text>
          </TouchableOpacity>
        </View>

        {fullList.map(item =>
          <ListCard
            key={item.id}
            id={item.id}
            brand={item.brand}
            model={item.model}
            hp={item.hp}
          />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50
  },
  listCard: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 5,
    borderRadius: 8,
    borderColor: '#f00',
    borderWidth: 2
  },
  addButton: {
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputs: {
    color: 'white',
    borderColor: 'blue',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  removeButton: {
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#ff6961',
    alignItems: 'center',
    justifyContent: 'center'
  },
})
