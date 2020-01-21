class Auestion:
   def __init__(self, par_id, par_questiontext, par_rightanswer, par_wronganswer1, par_wronganswer2, par_wronganswer3):
      self.__id = par_id
      self.__questiontext = par_questiontext
      self.__rightanswer = par_rightanswer
      self.__wronganswer1 = par_wronganswer1
      self.__wronganswer2 = par_wronganswer2
      self.__wronganswer3 = par_wronganswer3

   def __str__(self):
      return 'question'

   def __eq__(self, other):
      return self.__questiontext == other.__questiontext

   def __dict__(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

   @property
   def id(self):
       return self.__id

   @property
   def questiontext(self):
       return self.__questiontext

   @property
   def rightanswer(self):
      return self.__rightanswer

   @property
   def wronganswer1(self):
       return self.__wronganswer1

   @property
   def wronganswer2(self):
       return self.__wronganswer2

   @property
   def wronganswer1(self):
       return self.__wronganswer3


